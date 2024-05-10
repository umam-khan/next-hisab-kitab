'use client';
import clientConnectionWithSupabase from "@/lib/supabase";
const supabase = clientConnectionWithSupabase()
export const getProducts = async () => {
    const supabase = clientConnectionWithSupabase()
    let { data: products, error }: any = await supabase
        .from('inventory')
        .select("*")
        // .eq('workspace_id', workspace_id)
        // .order('created_at')
    console.log(products)
    if (products !== null) {
        return { success: true, products }
    } else {
        return { success: false, error: error.message }
    }
}

export const createProduct = async (formdata: any) => {
    const supabase = clientConnectionWithSupabase()
    console.log(formdata)
    const result: any = await supabase
        .from('inventory')
        .insert([
            { ...formdata },
        ])
        .select()

    if (result?.error !== null) {
        console.log(result)
        return { success: false, result}
    } else {
        return { success: true, result}
    }
}
