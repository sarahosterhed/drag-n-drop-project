import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities";
import { Card } from "../../models/Cards";

type CardProps = {
    card: Card;
}

export const CardContainer = ({ card }: CardProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: card.id,
        data: {
            type: "Card",
            card
        }
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform)
    }

    if (isDragging) {
        return <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            style={style}
            key={card.id}
            className="card placeholder"
        />;
    }

    return (
        <>
            <div
                ref={setNodeRef}
                {...attributes}
                {...listeners}
                style={style}
                key={card.id}
                className="card"
            >
                <h4>{card.name}</h4>
                <p>Co2: {card.co2}</p>
            </div>
        </>
    )
}
