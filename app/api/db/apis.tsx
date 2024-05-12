'use client';
import clientConnectionWithSupabase from "@/lib/supabase";
const supabase = clientConnectionWithSupabase()
export const getProducts = async (userId : any) => {
    let { data: products, error } = await supabase
        .from('inventory')
        .select("*")
        .eq('user_id', userId) // Filter by user_id
        .order('created_at', { ascending: false }); // Optional: order results

    if (products) {
        return { success: true, products };
    } else {
        return { success: false, error: error?.message };
    }
}

export const createProduct = async (formdata: any) => {
    console.log(formdata);
    const { data, error } = await supabase
        .from('inventory')
        .insert([
            { ...formdata },
        ])
        .select();
  
    if (error) {
        console.log(error);
        return { success: false, error };
    }
    return { success: true, data };
  }

  export const deleteProduct = async (product_id : any) => {
    console.log(product_id);
    
    const { error } = await supabase
    .from("inventory")
    .delete()
    .eq('id', product_id);
        
  
    if (error) {
        console.log(error);
        return { success: false, error };
    }
    return { success: true};
  }

  export const updateProduct = async (name : any, brand : any, user_id : any, updateData : any) => {
    console.log("Attempting to update product with name:", name, "and brand:", brand);
    console.log("Update data:", updateData);
  
    try {
      const { data, error } = await supabase
        .from('inventory')
        .update(updateData)
        .match({ product_name: name, brand: brand, user_id:user_id });
  
      if (error) {
        console.error('Update error:', error.message);
        return { success: false, error: error.message };
      }
  
      console.log('Updated product:', data);
      return { success: true, data };
    } catch (e) {
      console.error('Exception during update:', e);
      return { success: false, error: e };
    }
  };
  