import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { products } from "../../../data/products";

const dataFilePath = path.join(process.cwd(), "data", "products.ts");

export async function GET() {
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  try {
    const newProducts = await req.json();
    
    // Read the current file content
    const fileContent = fs.readFileSync(dataFilePath, "utf-8");
    
    // Convert the incoming products to a formatted string
    const newProductsString = JSON.stringify(newProducts, null, 2)
      // Clean up stringified quotes around object keys to keep it valid TS
      .replace(/"([^"]+)":/g, "$1:");

    // Find the export block and replace it
    // The block is from `export const products: Product[] = [` up to `];`
    const regex = /export const products: Product\[\] = \[[\s\S]*?\];/;
    const replacement = `export const products: Product[] = ${newProductsString};`;
    
    if (!regex.test(fileContent)) {
      throw new Error("Could not find products array in data file.");
    }
    
    const newFileContent = fileContent.replace(regex, replacement);
    
    // Write back to file
    fs.writeFileSync(dataFilePath, newFileContent, "utf-8");
    
    return NextResponse.json({ success: true, message: "Products updated successfully" });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
