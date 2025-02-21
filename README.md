# **Interactive Quiz Platform**

## **Overview**
The **Interactive Quiz Platform** is a web-based quiz application that allows users to attempt quizzes, receive instant feedback, track their progress, and save their attempt history. The platform supports multiple quiz attempts, bonus challenges, and a timer-based quiz system for an engaging learning experience.

## **Features**

### **Quiz Creation & Management**
- Displays a set of quiz questions from a predefined dataset.
- Users can attempt quizzes multiple times.
- Attempt history is saved and can be reviewed later.

### **User Interaction**
- Users select answers and receive **instant feedback** (correct/incorrect).
- **Timer-based quizzes** (30 seconds per question) to enhance engagement.

### **Progress Tracking**
- Displays a **scoreboard** at the end of each quiz.
- Users can see past attempts and scores.

### **Bonus Challenges**
- Provides extra bonus questions for additional scoring opportunities.
- Saves quiz history using **IndexedDB**.

## **Setup Instructions**

### **Installation**
1. Clone the repository:
   ```sh
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```sh
   cd quiz-app-
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Start the development server:
   ```sh
   npm run dev
   ```

### **Building for Production**
To build the project for deployment:
```sh
npm run build
```

## **Usage Instructions**
1. Start the quiz by selecting an answer.
2. Receive instant feedback on whether the selected answer is correct.
3. If the timer runs out, the next question is automatically loaded.
4. Complete the quiz to view your **final score**.
5. Attempt history is saved and can be accessed later.
6. Enter **bonus mode** for additional scoring opportunities.

## **Links**
- **Live App**: [Deployed Link](#)
- **GitHub Repository**: [Repo Link](#)

---

For any issues or contributions, feel free to open a pull request or submit an issue in the repository. 🚀

