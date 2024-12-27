import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Convert prisma object into a regular JS object

export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

export function formatNumberWithDecimal(num: number): string {
  const [int, deci] = num.toString().split(".");
  return deci ? `${int}.${deci.padEnd(2, "0")}` : `${int}.00`;
}


// Format Errors

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function formatError(error:any){
  if(error.name === "ZodError"){
    // Handle ZoD erro
    const fieldErrors = Object.keys(error.errors).map((field) => error.errors[field].message);
    return fieldErrors.join(". ");
  }
  else if (error.name ==="PrismaClientKnownRequestError" && error.code === 'P2002')
  {
    // Handle Prisma Error 
    const field = error.meta?.target ? error.meta.target[0] : 'Field';
    return `${field.charAt(0).toUpperCase() + field.slice(1)} is already taken`;

  }
  else {
    return typeof error.message === "string" ? error.message :JSON.stringify(error.message);

  }

}

// Round number to decimal places
export function round2(value:number | string){
  if (typeof value === 'number') {
    return Math.round((value+Number.EPSILON) * 100 )/100;

  }else if (typeof value === 'string'){
    return Math.round((Number(value)+Number.EPSILON) * 100 )/100;
  }else{
    throw new Error("Value is not a number or string")
  }

}


const CURRENCY_FORMATTER = new Intl.NumberFormat("en-US",{
  currency: 'USD',
  style:'currency',
  minimumFractionDigits:2

})

// Format Currency using the formatter above
export function formatCurrency(amount:number | string | null){
  if(typeof amount === 'number') {
    return CURRENCY_FORMATTER.format(amount) ;
  }else if (typeof amount === 'string') {
    return CURRENCY_FORMATTER.format(Number(amount)) ;
  }else
  return 'NaN'
}