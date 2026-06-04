import { useNavigate } from 'react-router-dom';
import { useInputs } from '../hooks/use-inputs';
import { useProducts } from '../hooks/use-products';
import { useOrders } from '../hooks/use-orders';
import { PackagePlus, ShoppingBag, Receipt, LayoutDashboard, Loader2 } from 'lucide-react';
import { EmptyStateCard } from '../components/empty-state-card';

export function HomePage() {
    const navigate = useNavigate();
    const { inputs, isLoading: isLoadingInputs } = useInputs();
    const { products, isLoading: isLoadingProducts } = useProducts();
    const { orders, isLoading: isLoadingOrders } = useOrders();

    const isLoading = isLoadingInputs || isLoadingProducts || isLoadingOrders;

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center p-12 w-full mt-10">
                    <Loader2 className="w-12 h-12 text-primary animate-spin" />
                </div>
            );
        }

        if (inputs.length === 0) {
            return (
                <EmptyStateCard
                    icon={PackagePlus}
                    title="Vamos começar!"
                    description="O primeiro passo é cadastrar seus insumos (ingredientes, embalagens ou custos indiretos) para poder compor seus produtos."
                    actionLabel="Cadastrar Insumo"
                    onAction={() => navigate('/dashboard/inputs')}
                />
            );
        }

        if (products.length === 0) {
            return (
                <EmptyStateCard
                    icon={ShoppingBag}
                    title="Insumos cadastrados!"
                    description="Agora que você já tem insumos, o próximo passo é criar seus produtos para poder realizar vendas."
                    actionLabel="Cadastrar Produto"
                    onAction={() => navigate('/dashboard/products')}
                />
            );
        }

        if (orders.length === 0) {
            return (
                <EmptyStateCard
                    icon={Receipt}
                    title="Tudo pronto para vender!"
                    description="Seus produtos estão cadastrados e prontos. Que tal registrar seu primeiro pedido?"
                    actionLabel="Fazer Pedido"
                    onAction={() => navigate('/dashboard/orders')}
                />
            );
        }

        return (
            <EmptyStateCard
                icon={LayoutDashboard}
                title="Bem-vindo de volta!"
                description="Seu catálogo está completo. Acesse a área de pedidos para acompanhar suas vendas ou adicionar novos registros."
                actionLabel="Ir para Pedidos"
                onAction={() => navigate('/dashboard/orders')}
            />
        );
    };

    return (
        <div className="flex flex-col w-full max-w-5xl mx-auto relative pt-6 px-4">
            {renderContent()}
        </div>
    );
}