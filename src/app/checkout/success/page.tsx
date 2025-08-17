import Image from "next/image";

const CheckoutSuccessPage = () => {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-full max-w-md">
                <div className="rounded-lg bg-background shadow-lg p-8 flex flex-col items-center gap-6">
                    <Image
                        width={64}
                        height={64}
                        src="/illustration.svg"
                        alt="success-ilustration"
                    />
                    <h2 className="text-2xl font-bold text-center">Pedido realizado com sucesso!</h2>
                    <p className="text-center text-muted-foreground">
                        Seu pagamento foi processado e seu pedido está sendo preparado.<br />
                        Você receberá um e-mail com os detalhes em breve.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CheckoutSuccessPage;