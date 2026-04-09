# MindCheck - Student Mental Health Assessment Platform

A comprehensive web-based platform designed to assess and monitor student mental health through validated psychological scales and assessments.

## Features

- **Multiple Assessment Tools**: Includes validated scales such as:
  - Beck Anxiety Inventory (BAI)
  - Beck Depression Inventory-II (BDI-II)
  - Digital Stress Scale
  - Flourishing Scale
  - General Health Questionnaire (GHQ-12)
  - Perceived Stress Scale (PSS-10)
  - Rosenberg Self-Esteem Scale (RSES)

- **Privacy-First Results Sharing**: 
  - Email results directly to yourself without server storage
  - Client-side processing ensures no personal data is stored
  - Google Forms integration for optional contact and support

- **Responsive Design**: Built with Tailwind CSS for optimal viewing across all devices
- **Modern React Architecture**: Developed using React 18 with Vite for fast development and building
- **Routing**: Client-side routing with React Router for seamless navigation

## Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Routing**: React Router DOM

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd mindcheck
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

1. Navigate through the different pages using the header navigation
2. Access various mental health assessments from the assessments section
3. After completing an assessment, view your results and optionally:
   - Email a summary of your results to yourself (client-side processing only)
   - Contact us with questions about your results through the integrated Google Form

## Privacy & Data Protection

MindCheck prioritizes user privacy and data protection:

- **No Server Storage**: All assessment data is processed client-side in the browser
- **No Personal Data Collection**: Raw scores and personal information are never stored
- **Client-Side Email Generation**: Results emails are generated and sent directly from your device
- **Optional Feedback**: Google Forms integration allows anonymous feedback collection
- **Third-Party Compliance**: Google Forms has separate privacy policies for form submissions

## Assessment Results

Results include:
- Assessment interpretation and description
- Support resource recommendations
- Important disclaimers about professional consultation
- Options for sharing results privately
3. Complete assessments to receive personalized results and insights
4. View results and recommendations on the results page

## Building for Production

To build the application for production:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Contributing

Please ensure all contributions maintain the platform's focus on student mental health and adhere to ethical guidelines for mental health assessments.

## License

This project is private and proprietary.