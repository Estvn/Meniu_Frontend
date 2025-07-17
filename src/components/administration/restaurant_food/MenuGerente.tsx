"use client";
import { HeaderNavBar } from "../navbar/HeaderNavBar";
import { SearchSection } from "./SearchSection";
import { StatsCards } from "./StatsCards";
import { MenuItemsList } from "./MenuItemsList";
import { FormularioCrearAlimento } from "../forms/FormularioCrearAlimento";
import { ModalEliminarConfirmacion } from "../forms/ModalEliminarAlimento";
import { useState } from "react";

interface FoodFormData {
  name: string;
  description: string;
  price: string;
  category: string;
  photo: File | null;
}

interface FoodData {
  id: number;
  name: string;
  description: string;
  price: string;
  category: string;
  status: string;
  image: string;
}

export function MenuGerente() {
  const [showCrearAlimento, setShowCrearAlimento] = useState(false);
  const [editingFood, setEditingFood] = useState<FoodData | null>(null);
  const [showEliminarAlimento, setShowEliminarAlimento] = useState(false);
  const [deletingFood, setDeletingFood] = useState<FoodData | null>(null);

  const handleOpenCrearAlimento = () => setShowCrearAlimento(true);
  const handleEditFood = (food: FoodData) => {
    setEditingFood(food);
    setShowCrearAlimento(true);
  };

  const handleDeleteFood = (food: FoodData) => {
    setDeletingFood(food);
    setShowEliminarAlimento(true);
  };

  const handleCloseForm = () => {
    setShowCrearAlimento(false);
    setEditingFood(null);
  };

  const handleCloseDeleteModal = () => {
    setShowEliminarAlimento(false);
    setDeletingFood(null);
  };

  const handleSubmitFood = (data: FoodFormData) => {
    if (editingFood) {
      console.log("Actualizando alimento:", { ...data, id: editingFood.id });
      // Aquí iría la lógica para actualizar el alimento
    } else {
      console.log("Creando nuevo alimento:", data);
      // Aquí iría la lógica para crear el alimento
    }
    handleCloseForm();
  };

  const handleConfirmDelete = () => {
    if (deletingFood) {
      console.log("Eliminando alimento:", deletingFood);
      // Aquí iría la lógica para eliminar el alimento
    }
    handleCloseDeleteModal();
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <HeaderNavBar title="Menú" subtitle="Gestión de Menú" />
      <div className="flex-1 flex flex-col pt-16 sm:pt-18 md:pt-20">
        <SearchSection />
        <StatsCards onAddItemClick={handleOpenCrearAlimento} />
        <MenuItemsList onEditFood={handleEditFood} onDeleteFood={handleDeleteFood} />
      </div>
      {showCrearAlimento && (
        <FormularioCrearAlimento 
          mode={editingFood ? "edit" : "create"}
          initialData={editingFood ? {
            name: editingFood.name,
            description: editingFood.description,
            price: editingFood.price,
            category: editingFood.category,
            photo: null, // La imagen actual no se puede convertir a File, se mantiene null
          } : undefined}
          onClose={handleCloseForm} 
          onCancel={handleCloseForm}
          onSubmit={handleSubmitFood}
        />
      )}
      {showEliminarAlimento && (
        <ModalEliminarConfirmacion
          title="Eliminar Alimento del Menú"
          onClose={handleCloseDeleteModal}
          onCancel={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
        />
      )}
    </main>
  );
}

export default MenuGerente;
