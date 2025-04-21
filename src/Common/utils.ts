import * as bcrypt from 'bcrypt';

export async function hashString(plainText: string): Promise<string> {
    const saltRounds = 10;
    const hashedString = await bcrypt.hash(plainText, saltRounds);
    return hashedString;
}

export async function compareHash(plainText: string, hash: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(plainText, hash);
    return isMatch;
}

export function parseNumber(value: string) {
const [start, end] = value.split('-');
return { start: +start, end: +end }
}

export function dateFilter(value: number) {
    const filterDate = new Date();
    filterDate.setDate(filterDate.getDate() - value);
    return {
        createdAt: {
            gte: filterDate
        }
    }
}
