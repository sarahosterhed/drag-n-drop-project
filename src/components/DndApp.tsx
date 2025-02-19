import { closestCorners, DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useState } from "react";
import { cardData } from "../cards";
import { TopCards } from "./TopCards/TopCards";
import { BottomCards } from "./BottomCards/BottomCards";
import { CardContainer } from "./Card/CardContainer";
import { createPortal } from "react-dom";
import { Cards, Card, SectionIdType } from "../models/Cards";


// Types


export const DndApp = () => {

    const [cards, setCards] = useState<Cards>(cardData)
    // const [startCard, setStartCard] = useState<Card | null>(null)

    // const initialCardPile = cards
    //     .filter((card) => card.id !== randomCard.id);

    // const [topCards, setTopCards] = useState<Cards>(initialCardPile);
    // const [bottomCards, setBottomCards] = useState<Cards>([randomCard]);


    const [activeCard, setActiveCard] = useState<Card | null>(null);

    console.log("cards", cards)


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
        if (!isOverACard) return;

        //Dropping a Card over another Card
        if (isActiveACard && isOverACard) {
            setCards((cards) => {
                const activeIndex = cards.findIndex((card) => card.id === activeCardId)
                const overIndex = cards.findIndex((card) => card.id === overCardId);

                if (cards[activeIndex].sectionId === SectionIdType.BOTTOM) {
                    cards[activeIndex].sectionId = cards[overIndex].sectionId
                }

                return arrayMove(cards, activeIndex, overIndex)
            })
        }

        const isOverASection = over.data.current?.type === "Section";
        if (!isOverASection) return;

        // Dropping a card over the Top Section
        if (isActiveACard && isOverASection) {
            setCards((cards) => {
                const activeIndex = cards.findIndex((card) => card.id === activeCardId)

                cards[activeIndex].sectionId = SectionIdType.TOP

                return arrayMove(cards, activeIndex, activeIndex)
            })
        }
    }



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

    const shuffleCards = (cards: Cards): Cards => {
        const shuffledCards = [...cards]
        for (let i = shuffledCards.length - 1; i > 0; i--) {
            const random = Math.floor(Math.random() * (i + 1));

            [shuffledCards[i], shuffledCards[random]] = [shuffledCards[random], shuffledCards[i]]
        }
        return shuffledCards;
    }

    const handleStart = () => {
        console.log("Före nollställning", cards)
        setCards((prevCards) => {
            const resetCards = prevCards.map((card) => ({ ...card, sectionId: SectionIdType.BOTTOM }));
            const shuffledCards = shuffleCards(resetCards);
            const updatedCards = [{ ...shuffledCards[0], sectionId: SectionIdType.TOP },
            ...shuffledCards.slice(1),
            ];
            return updatedCards;
        })


        console.log("Efter nollställning", cards)
        console.log("Efter blandning", cards)
        console.log("Efter uppdatering av startkort", cards)
    }


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
                onDragEnd={handleDragEnd}
            >

                <TopCards id={SectionIdType.TOP} cards={cards.filter((card) => card.sectionId === SectionIdType.TOP)} />

                <BottomCards
                    id={SectionIdType.BOTTOM}
                    cards={cards.filter((card) => card.sectionId === SectionIdType.BOTTOM)} />

                {createPortal(
                    <DragOverlay>
                        {activeCard && <CardContainer card={activeCard} />}
                    </DragOverlay>,
                    document.body
                )}
            </DndContext>

            <button onClick={handleStart}>Click to Start!</button>
        </div >
    )
}
