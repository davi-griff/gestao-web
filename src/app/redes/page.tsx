import ButtonRedirect from "@/components/button-redirect";
import { columns } from "./columns";

import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { PlusIcon } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { getRedes } from "@/utils/gestao-api/rede-client";

export default async function RedesPage() {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) {
        redirect('/login')
    }

    const redes = await getRedes();

    return (
        <div>
            <div>
                <DataTable columns={columns} data={redes} path="/redes" />
            </div>

            <div className="flex justify-end mt-4">
                <ButtonRedirect href="/redes/nova_rede">
                    <PlusIcon className="w-4 h-4" />
                    Nova Rede
                </ButtonRedirect>
            </div>
        </div>
    )
    
}