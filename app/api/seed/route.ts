import { NextResponse } from "next/server";
import { db } from "../../../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { products } from "../../../data/products";

export async function GET() {
  try {
    const promises = products.map((product) => 
      setDoc(doc(db, "products", product.id), product)
    );
    
    await Promise.all(promises);
    return NextResponse.json({ success: true, message: "Products successfully seeded to Firestore!" });
  } catch (error: any) {
    console.error("Seed error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
