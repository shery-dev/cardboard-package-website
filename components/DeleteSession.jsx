"use server"

import { cookies } from "next/headers";

export async function DeleteSession() {
    try {
        cookies().delete('session')
    } catch (error) {
        console.error("Unable to delete!", error);
    }
}
