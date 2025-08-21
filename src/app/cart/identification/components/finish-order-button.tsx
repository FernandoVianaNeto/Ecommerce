"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface FinishOrderButtonProps {
    isUpdating: boolean;
    onClick: () => void;
}

const FinishOrderButton = ({ isUpdating, onClick }: FinishOrderButtonProps) => {
    return (
        <Button
            className="w-full"
            disabled={isUpdating}
            onClick={onClick}
        >
            {isUpdating ? <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                "Go to payment"
            </> : "Go to payment"}
        </Button>
    )
}

export default FinishOrderButton;