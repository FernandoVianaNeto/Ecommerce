"use client";

import { Button } from "@/components/ui/button";

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
            {isUpdating ? "Going to payment..." : "Go to payment"}
        </Button>
    )
}

export default FinishOrderButton;