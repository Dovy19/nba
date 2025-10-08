'use server';

import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';
import { createSession, deleteSession } from '@/lib/auth/session';
import { getUser } from '@/lib/db';

export async function login(prevState: any, formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  // Validate inputs
  if (!username || !password) {
    return { error: 'Username and password are required' };
  }

  try {
    // Get user from database
    const user = await getUser(username);

    if (!user) {
      return { error: 'Invalid username or password' };
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return { error: 'Invalid username or password' };
    }

    // Create session with ID as string
    await createSession({
      id: user.id.toString(), // Convert number to string
      username: user.username,
      isAdmin: user.isAdmin,
    });

    return { success: true };
  } catch (error) {
    console.error('Login error:', error);
    return { error: 'An error occurred during login' };
  }
}

export async function logout() {
  await deleteSession();
  redirect('/login');
}