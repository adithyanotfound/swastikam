import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import { PrismaClient } from '@prisma/client';
import instructions from '../utils/instructions';

//Issues
//1. Add support for multiple users (sessions)
//4. Create routes for admin stuff (maybe use next.js admin login) and add auth

dotenv.config();

const router = express.Router();
const prisma = new PrismaClient();

// date and time
const currentDate = new Date();
const year = currentDate.getFullYear();
const month = currentDate.getMonth() + 1;
const day = currentDate.getDate();
const date = `${year}-${month}-${day}`;
let hours = currentDate.getHours();
const minutes = currentDate.getMinutes();
const ampm = hours >= 12 ? 'PM' : 'AM';
hours = hours % 12 || 12; // Convert to 12-hour format
const time = `${hours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`; // e.g., "2:30 PM"
const dayNumber = currentDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const dayName = daysOfWeek[dayNumber];

// gemini config
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const model: GenerativeModel = genAI.getGenerativeModel({ 
  model: "gemini-2.5-flash",
  systemInstruction: instructions,
  generationConfig: {
    temperature: 0.1
  }
});

interface ChatResponse {
  reply: string;
  query: {
    name: string;
    contact: string;
    doctor: string;
    time: string;
    date: string;
  } | null;
}

let chatTemplate = {
  history: [
    {
      role: "user",
      parts: [{
        text: `You are a hospital desk assistant`}],
    },
    {
      role: "model",
      parts: [{ text: "Sure I will act like a hospital desk assistant with the given instructions." }],
    },
  ],
}

const chatTemplateUnmodified = JSON.parse(JSON.stringify(chatTemplate));;

router.post('/chat', async (req: Request, res: Response): Promise<void> => {
  const userPrompt: string = req.body.userPrompt;

  let appointments = await prisma.appointment.findMany();
  console.log("Current appointments in database:", appointments);
  let storedBookedSlots: string[] = appointments.map(appointment =>
    `${appointment.date?.toString().split('T')[0]} ${appointment.time}`
  );
  console.log("Booked slots:", storedBookedSlots);

  // console.log(chatTemplate);
  const chat = model.startChat(chatTemplate);

  try {
    let result = await chat.sendMessage(userPrompt);
    let response = result.response?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!response) {
      throw new Error("No response from AI model");
    }
    chatTemplate.history.push({
      role: "user",
      parts: [{ text: userPrompt + `The doctor is already booked on the following dates and times: ${storedBookedSlots}.` }]
    });

    // Try to parse as JSON, if it fails, create a fallback response
    let obj: ChatResponse;
    try {
      obj = JSON.parse(response);
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", response);
      console.error("Parse error:", parseError);
      
      // Try to extract JSON from the response if it's mixed with text
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          obj = JSON.parse(jsonMatch[0]);
        } catch (secondParseError) {
          console.error("Failed to parse extracted JSON:", jsonMatch[0]);
          // Create a fallback response
          obj = {
            reply: response,
            query: null
          };
        }
      } else {
        // Create a fallback response
        obj = {
          reply: response,
          query: null
        };
      }
    }

    //@ts-ignore
    //The comparison is intentional.
    if (obj.query === 'END') {
      chatTemplate = JSON.parse(JSON.stringify(chatTemplateUnmodified)); //still doesn't clear
    }
    // Create appointment (Create more in future for rescheduling etc..)
    else if (obj.query != null) {
      try {
        console.log("Creating appointment with data:", obj.query);
        const appointment = await prisma.appointment.create({
          data: {
            name: obj.query.name,
            contact: obj.query.contact,
            doctor: obj.query.doctor,
            date: obj.query.date,
            time: obj.query.time,
          },
        });
        console.log("Appointment created successfully:", appointment);
      } catch (error) {
        console.error("Error saving appointment:", error);
      }
    }

    res.status(200).json({
      obj,
    });
    chatTemplate.history.push({
      role: "model",
      parts: [{ text: obj.reply }]
    });
  } catch (error) {
    console.error("Error processing chat:", error);
    res.status(500).json({ message: "Error processing chat request." });
  }
});

export default router;