import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Bill } from '@/models/Bill';

// Path to our JSON file for data storage
const dataFilePath = path.join(process.cwd(), 'data', 'bills.json');

// Ensure data directory exists
async function ensureDirectoryExists() {
  const dataDir = path.join(process.cwd(), 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// Initialize bills file if it doesn't exist
async function initializeBillsFile() {
  try {
    await fs.access(dataFilePath);
  } catch {
    await ensureDirectoryExists();
    await fs.writeFile(dataFilePath, JSON.stringify({ bills: [] }));
  }
}

// GET handler to retrieve bills
export async function GET() {
  try {
    await initializeBillsFile();
    const fileContent = await fs.readFile(dataFilePath, 'utf8');
    const data = JSON.parse(fileContent);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading bills:', error);
    return NextResponse.json(
      { error: 'Failed to read bills data' },
      { status: 500 }
    );
  }
}

// POST handler to save bills
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate the incoming data
    if (!data || !Array.isArray(data.bills)) {
      return NextResponse.json(
        { error: 'Invalid data format' },
        { status: 400 }
      );
    }

    await ensureDirectoryExists();
    await fs.writeFile(dataFilePath, JSON.stringify(data));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving bills:', error);
    return NextResponse.json(
      { error: 'Failed to save bills data' },
      { status: 500 }
    );
  }
}
