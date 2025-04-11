import NovoMembroCelulaForm from "@/components/form-novo-membro-celula";

export default function NovoMembroCelulaPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-center">Cadastro de Membro</h1>
            <div className="max-w-2xl mx-auto">
                <NovoMembroCelulaForm />
            </div>
        </div>
    )
}