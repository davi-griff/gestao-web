import EncontroCelulaForm from "@/components/form-encontro-celula";

export default function NovoEncontroPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-center">Cadastro de Encontro</h1>
            <div className="max-w-2xl mx-auto">
                <EncontroCelulaForm />
            </div>
        </div>
    )
}
