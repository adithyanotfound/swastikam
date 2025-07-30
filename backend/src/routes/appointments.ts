import express, { Request, Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get all appointments
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Fetching all appointments...');
    const appointments = await prisma.appointment.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    console.log('Found appointments:', appointments.length);
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Error fetching appointments' });
  }
});

// Get appointment by ID
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const appointment = await prisma.appointment.findUnique({
      where: { id }
    });
    
    if (!appointment) {
      res.status(404).json({ message: 'Appointment not found' });
      return;
    }
    
    res.json(appointment);
  } catch (error) {
    console.error('Error fetching appointment:', error);
    res.status(500).json({ message: 'Error fetching appointment' });
  }
});

// Update appointment
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, contact, doctor, date, time } = req.body;
    
    // Validate phone number
    const phoneRegex = /^\d{10}$/;
    if (contact && !phoneRegex.test(contact.replace(/\s/g, ''))) {
      res.status(400).json({ message: 'Invalid phone number. Must be 10 digits.' });
      return;
    }
    
    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: {
        name,
        contact,
        doctor,
        date,
        time,
      }
    });
    
    res.json(updatedAppointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      res.status(404).json({ message: 'Appointment not found' });
    } else {
      res.status(500).json({ message: 'Error updating appointment' });
    }
  }
});

// Delete appointment
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.appointment.delete({
      where: { id }
    });
    
    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      res.status(404).json({ message: 'Appointment not found' });
    } else {
      res.status(500).json({ message: 'Error deleting appointment' });
    }
  }
});

// Test endpoint to verify database connection
router.get('/test/connection', async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Testing database connection...');
    
    // Test creating a simple record
    const testAppointment = await prisma.appointment.create({
      data: {
        name: 'Test User',
        contact: '1234567890',
        doctor: 'test',
        date: '2025-01-01',
        time: '4:00 PM',
      },
    });
    console.log('Test appointment created:', testAppointment);
    
    // Test fetching it back
    const fetched = await prisma.appointment.findUnique({
      where: { id: testAppointment.id }
    });
    console.log('Test appointment fetched:', fetched);
    
    // Clean up - delete the test record
    await prisma.appointment.delete({
      where: { id: testAppointment.id }
    });
    console.log('Test appointment deleted');
    
    res.json({ 
      message: 'Database connection test successful',
      created: testAppointment,
      fetched: fetched
    });
  } catch (error) {
    console.error('Database connection test failed:', error);
    res.status(500).json({ 
      message: 'Database connection test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router; 