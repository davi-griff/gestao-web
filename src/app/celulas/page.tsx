import ButtonRedirect from "@/components/button-redirect";
import { columns } from "./columns";
import { DataTable } from "@/components/data-table";
import { PlusIcon } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getCelulas } from "@/utils/gestao-api/celula-client";


export default async function CelulasPage() {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) {
        redirect('/login')
    }

    const celulas = await getCelulas();
    return (
        <div>
            <div>
                <DataTable columns={columns} data={celulas} path="/celulas" />
            </div>

            <div className="flex justify-end mt-4">
                <ButtonRedirect href="/celulas/novo_celula">
                    <PlusIcon className="w-4 h-4" />
                    Nova Celula
                </ButtonRedirect>
            </div>
        </div>
    )
}
