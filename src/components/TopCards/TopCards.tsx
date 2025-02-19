import { horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";

import "./TopCards.css";
import { Cards, SectionIdType } from "../../models/Cards";
import { CardContainer } from "../Card/CardContainer";
import { useMemo } from "react";
import { useDroppable } from "@dnd-kit/core";

type CardsProps = {
    cards: Cards;
    id: SectionIdType;
}

export const TopCards = ({ cards, id }: CardsProps) => {

    const { setNodeRef } = useDroppable({
        id: id,
        data: {
            type: "Section",
        }
    })




    const cardsIds = useMemo(() => {
        return cards.map((card) => card.id);
    }, [cards])


    return (
        <section id="top-cards" className="card-deck" ref={setNodeRef}>
            <SortableContext items={cardsIds} strategy={horizontalListSortingStrategy}>
                {cards.map((card) => (
                    <CardContainer card={card} key={card.id} />
                )
                )}
            </SortableContext>

        </section >
    )
}
