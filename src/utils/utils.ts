export const sleep = async (seconds: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, seconds * 1000))

export const  generateHash = (length: number = 4) => Math.random().toString(36).substring(2, 2 + length)