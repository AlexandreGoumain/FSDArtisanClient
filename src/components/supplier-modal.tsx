import type { Supplier } from "@/store/api/types/suppliersType";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface SupplierModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    isCreating: boolean;
    selectedSupplier: Supplier | null;
    onSave: (supplierData: Partial<Supplier>) => void;
}

export function SupplierModal({
    open,
    onOpenChange,
    isCreating,
    selectedSupplier,
    onSave,
}: SupplierModalProps) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    // Charger les informations du fournisseur (modification) ou réinitialiser (création)
    useEffect(() => {
        if (selectedSupplier && open && !isCreating) {
            setName(selectedSupplier.name);
            setEmail(selectedSupplier.email);
            setPhone(selectedSupplier.phone);
        } else if (open && isCreating) {
            setName("");
            setEmail("");
            setPhone("");
        }
    }, [selectedSupplier, open, isCreating]);

    // Handlers
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhone(e.target.value);
    };

    const handleSave = () => {
        const supplierData = {
            name,
            email,
            phone,
        };

        onSave(supplierData);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {isCreating
                            ? "Ajouter un fournisseur"
                            : "Modifier le fournisseur"}
                    </DialogTitle>
                    <DialogDescription>
                        {isCreating
                            ? "Créer un nouveau fournisseur"
                            : `Modification des informations de ${selectedSupplier?.name}`}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nom du fournisseur</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={handleNameChange}
                            placeholder="Ex: Mobilier Pro France"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={handleEmailChange}
                            placeholder="contact@fournisseur.fr"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">Téléphone</Label>
                        <Input
                            id="phone"
                            type="tel"
                            value={phone}
                            onChange={handlePhoneChange}
                            placeholder="+33 1 23 45 67 89"
                        />
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Annuler
                        </Button>
                        <Button onClick={handleSave}>
                            {isCreating ? "Créer" : "Sauvegarder"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
