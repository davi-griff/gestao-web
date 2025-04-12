import RedeForm from "@/components/form-rede"

export default function NovaRedePage() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-center">Cadastro de Rede</h1>
            <div className="max-w-2xl mx-auto">
                <RedeForm />
            </div>
        </div>
    )
}