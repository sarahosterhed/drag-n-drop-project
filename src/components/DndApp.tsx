import { closestCorners, DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, horizontalListSortingStrategy, SortableContext, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useMemo, useState } from "react";
import { cardData } from "../cards";
import { TopCards } from "./TopCards/TopCards";
import { BottomCards } from "./BottomCards/BottomCards";
import { CardContainer } from "./Card/CardContainer";
import { createPortal } from "react-dom";
import { Cards, Card, SectionIdType } from "../models/Cards";


// Types


export const DndApp = () => {

    const [cards, setCards] = useState<Cards>(cardData)

    // const randomCard = {
    //     ...[...cards].sort(() => Math.random() - 0.5)[0],
    //     sectionId: SectionIdType.TOP
    // };

    // const initialCardPile = cards
    //     .filter((card) => card.id !== randomCard.id);

    // const [topCards, setTopCards] = useState<Cards>(initialCardPile);
    // const [bottomCards, setBottomCards] = useState<Cards>([randomCard]);


    const [activeCard, setActiveCard] = useState<Card | null>(null);

    console.log("cards", cards)
    // console.log("bottomCards", bottomCards)
    // console.log("initial", initialCardPile)





    // Dnd handlers
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),

    );


    const handleDragStart = (event: DragStartEvent) => {
        console.log("Drag Start", event)


        if (event.active.data.current?.type === "Card") {
            setActiveCard(event.active.data.current.card);
            return;
        }
    }

    const handleDragOver = (event: DragOverEvent) => {
        console.log("Drag Over", event)
        const { active, over } = event;
        if (!over) return;

        const activeCardId = active.id;
        const overCardId = over.id;

        if (activeCardId === overCardId) return;

        const isActiveACard = active.data.current?.type === "Card";
        const isOverACard = over.data.current?.type === "Card";

        if (!isActiveACard) return;

        //Dropping a Card over another Card
        if (isActiveACard && isOverACard) {
            setCards((cards) => {
                const activeIndex = cards.findIndex((card) => card.id === activeCardId)
                const overIndex = cards.findIndex((card) => card.id === overCardId);

                if (cards[activeIndex].sectionId !== cards[overIndex].sectionId) {
                    cards[activeIndex].sectionId = cards[overIndex].sectionId
                }

                return arrayMove(cards, activeIndex, overIndex)
            })
        }

        const isOverASection = over.data.current?.type === "Section";

        // Dropping a card over the Top Section
        if (isActiveACard && isOverASection) {
            setCards((cards) => {
                const activeIndex = cards.findIndex((card) => card.id === activeCardId)

                cards[activeIndex].sectionId = SectionIdType.TOP

                return arrayMove(cards, activeIndex, activeIndex)
            })
        }
    }



    // const handleDragMove = (event: DragMoveEvent) => {

    // }

    const handleDragEnd = (event: DragEndEvent) => {
        setActiveCard(null);

        console.log("drag end", event)

        const { active, over } = event;
        if (!over) return;

        const activeCardId = active.id;
        const overCardId = over.id;

        if (activeCardId === overCardId) return;

        setCards(
            (cards) => {
                const activeCardIndex = cards.findIndex((card) => card.id === activeCardId);

                const overCardIndex = cards.findIndex((card) => card.id === overCardId);

                return arrayMove(cards, activeCardIndex, overCardIndex)
            }
        )

    }


    // const {
    //         attributes,
    //         listeners,
    //         setNodeRef,
    //         transform,
    //         transition,
    //         isDragging,
    //     } = useSortable({
    //         id: card.id,
    //         data: {
    //             type: "Card",
    //             card
    //         }
    //     });

    //     const style = {
    //         transition,
    //         transform: CSS.Transform.toString(transform)
    //     }




    return (
        <div className="w-full">
            <div className="flex justify-center  gap-y-2">
                <h1 className="text-white text-3xl font-bold">Dnd-kit</h1>
            </div>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                // onDragMove={handleDragMove}
                onDragEnd={handleDragEnd}
            >
                <SortableContext items={cards} strategy={horizontalListSortingStrategy}>

                    <TopCards id={SectionIdType.TOP} cards={cards.filter((card) => card.sectionId === SectionIdType.TOP)} />

                    <BottomCards
                        id={SectionIdType.BOTTOM}
                        cards={cards.filter((card) => card.sectionId === SectionIdType.BOTTOM)} />
                </SortableContext>

                {createPortal(
                    <DragOverlay>
                        {activeCard && <CardContainer card={activeCard} />}
                    </DragOverlay>, document.body
                )}
            </DndContext>
        </div >
    )
}
