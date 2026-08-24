import { NextResponse } from "next/server";
import { db } from "../../../lib/firebase";
import { collection, getDocs, doc, writeBatch } from "firebase/firestore";
import type { Product } from "../../../data/products";

// GET all products from Firestore
export async function GET() {
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    const products: Product[] = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() } as Product);
    });
    return NextResponse.json(products);
  } catch (error: any) {
    console.error("GET Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST replaces the entire collection (simplified logic mirroring the previous local array replace)
export async function POST(req: Request) {
  try {
    const newProducts: Product[] = await req.json();
    
    // Using a batch to write multiple documents
    const batch = writeBatch(db);

    // Get all current products to delete the ones that are no longer there
    const querySnapshot = await getDocs(collection(db, "products"));
    
    // Delete all current documents first
    querySnapshot.forEach((document) => {
      batch.delete(document.ref);
    });

    // Add all the new ones
    newProducts.forEach((product) => {
      const docRef = doc(db, "products", product.id);
      batch.set(docRef, product);
    });

    // Commit the batch
    await batch.commit();
    
    return NextResponse.json({ success: true, message: "Products updated in Firestore successfully" });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
