const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { db } = require('../config/database');
const jwt = require('jsonwebtoken');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

const runQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this);
    });
  });
};

const getQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
};

const allQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

// Middleware to verify admin JWT token
const verifyAdmin = (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Validation middleware for BFI-10 submission
const validateBFI10Submission = [
  body('userID').notEmpty().withMessage('User ID is required'),
  body('anonymous').isBoolean().withMessage('Anonymous must be a boolean'),
  body('consentGiven').isBoolean().withMessage('Consent given must be a boolean'),
  body('responses').isArray({ min: 10, max: 10 }).withMessage('Must provide exactly 10 responses'),
  body('responses.*').isInt({ min: 1, max: 5 }).withMessage('Each response must be between 1 and 5'),
  body('oceanScores').isObject().withMessage('Ocean scores must be an object'),
  body('interpretation').isObject().withMessage('Interpretation must be an object')
];

// POST /api/bfi10-submissions - Save new submission
router.post('/submissions', validateBFI10Submission, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const {
      userID,
      timestamp,
      anonymous,
      userInfo,
      consentGiven,
      responses,
      oceanScores,
      interpretation
    } = req.body;

    const insertResult = await runQuery(
      `INSERT INTO bfi10_submissions
        (user_id, timestamp, submission_mode, user_info, consent_given, responses, scores, interpretation)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userID,
        timestamp || new Date().toISOString(),
        anonymous ? 'anonymous' : 'identified',
        anonymous ? null : JSON.stringify(userInfo),
        consentGiven ? 1 : 0,
        JSON.stringify(responses),
        JSON.stringify(oceanScores),
        JSON.stringify(interpretation)
      ]
    );

    const newSubmission = await getQuery('SELECT id, created_at FROM bfi10_submissions WHERE id = ?', [insertResult.lastID]);

    res.status(201).json({
      message: 'Submission saved successfully',
      id: newSubmission.id,
      created_at: newSubmission.created_at
    });
  } catch (error) {
    console.error('Error saving submission:', error);
    res.status(500).json({ error: 'Failed to save submission' });
  }
});

// GET /api/bfi10-submissions/stats - Get submission statistics (admin only)
router.get('/submissions/stats', verifyAdmin, async (req, res) => {
  try {
    const totalResult = await getQuery('SELECT COUNT(*) as total FROM bfi10_submissions');
    const identifiedResult = await getQuery("SELECT COUNT(*) as identified FROM bfi10_submissions WHERE submission_mode = 'identified'");
    const anonymousResult = await getQuery("SELECT COUNT(*) as anonymous FROM bfi10_submissions WHERE submission_mode = 'anonymous'");
    const todayResult = await getQuery("SELECT COUNT(*) as today FROM bfi10_submissions WHERE DATE(created_at) = DATE('now')");

    res.json({
      total: parseInt(totalResult.total, 10) || 0,
      identified: parseInt(identifiedResult.identified, 10) || 0,
      anonymous: parseInt(anonymousResult.anonymous, 10) || 0,
      today: parseInt(todayResult.today, 10) || 0
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});
router.get('/submissions', verifyAdmin, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('type').optional().isIn(['all', 'identified', 'anonymous']).withMessage('Type must be all, identified, or anonymous'),
  query('search').optional().isString().withMessage('Search must be a string')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const {
      page = 1,
      limit = 50,
      type = 'all',
      search = ''
    } = req.query;

    const offset = (page - 1) * limit;

    // Build query based on filters
    let whereClause = '';
    let params = [];

    if (type === 'identified') {
      whereClause += ` WHERE submission_mode = ?`;
      params.push('identified');
    } else if (type === 'anonymous') {
      whereClause += ` WHERE submission_mode = ?`;
      params.push('anonymous');
    }

    if (search) {
      const searchCondition = whereClause ? ' AND' : ' WHERE';
      whereClause += `${searchCondition} (
        json_extract(user_info, '$.fullName') LIKE ? OR
        json_extract(user_info, '$.rollNumber') LIKE ? OR
        json_extract(user_info, '$.email') LIKE ?
      )`;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    const countResult = await getQuery(
      `SELECT COUNT(*) as total FROM bfi10_submissions${whereClause}`,
      params
    );
    const total = parseInt(countResult.total, 10) || 0;

    const submissionRows = await allQuery(
      `SELECT
        id,
        user_id,
        timestamp,
        submission_mode,
        user_info,
        consent_given,
        responses,
        scores,
        interpretation,
        created_at
      FROM bfi10_submissions
      ${whereClause}
      ORDER BY timestamp DESC
      LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    const submissions = submissionRows.map(row => ({
      id: row.id,
      userID: row.user_id,
      timestamp: row.timestamp,
      anonymous: row.submission_mode === 'anonymous',
      userInfo: row.user_info ? JSON.parse(row.user_info) : null,
      consentGiven: Boolean(row.consent_given),
      responses: row.responses ? JSON.parse(row.responses) : [],
      oceanScores: row.scores ? JSON.parse(row.scores) : {},
      interpretation: row.interpretation ? JSON.parse(row.interpretation) : {},
      created_at: row.created_at
    }));

    res.json({
      submissions,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

// GET /api/bfi10-submissions/:id - Get individual submission (admin only)
router.get('/submissions/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const row = await getQuery(`
      SELECT
        id,
        user_id,
        timestamp,
        submission_mode,
        user_info,
        consent_given,
        responses,
        scores,
        interpretation,
        created_at
      FROM bfi10_submissions
      WHERE id = ?
    `, [id]);

    if (!row) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    const submission = {
      id: row.id,
      userID: row.user_id,
      timestamp: row.timestamp,
      anonymous: row.submission_mode === 'anonymous',
      userInfo: row.user_info ? JSON.parse(row.user_info) : null,
      consentGiven: Boolean(row.consent_given),
      responses: row.responses ? JSON.parse(row.responses) : [],
      oceanScores: row.scores ? JSON.parse(row.scores) : {},
      interpretation: row.interpretation ? JSON.parse(row.interpretation) : {},
      created_at: row.created_at
    };

    res.json({ submission });

  } catch (error) {
    console.error('Error fetching submission:', error);
    res.status(500).json({ error: 'Failed to fetch submission' });
  }
});

// DELETE /api/bfi10-submissions/:id - Delete submission (admin only)
router.delete('/submissions/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const deleteResult = await runQuery(
      'DELETE FROM bfi10_submissions WHERE id = ?',
      [id]
    );

    if (deleteResult.changes === 0) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    res.json({ message: 'Submission deleted successfully' });

  } catch (error) {
    console.error('Error deleting submission:', error);
    res.status(500).json({ error: 'Failed to delete submission' });
  }
});

// GET /api/bfi10-submissions/stats - Get submission statistics (admin only)
router.get('/submissions/stats', verifyAdmin, async (req, res) => {
  try {
    const stats = await getQuery(`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN submission_mode = 'identified' THEN 1 ELSE 0 END) as identified,
        SUM(CASE WHEN submission_mode = 'anonymous' THEN 1 ELSE 0 END) as anonymous,
        SUM(CASE WHEN date(created_at) = date('now') THEN 1 ELSE 0 END) as today
      FROM bfi10_submissions
    `);

    res.json({
      total: parseInt(stats.total, 10),
      identified: parseInt(stats.identified, 10) || 0,
      anonymous: parseInt(stats.anonymous, 10) || 0,
      today: parseInt(stats.today, 10) || 0
    });

  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

module.exports = router;