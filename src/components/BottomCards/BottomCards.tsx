import { Cards } from "../../models/Cards";
import { CardContainer } from "../Card/CardContainer";


type CardsProps = {
    cards: Cards;
    id: string;
};

export const BottomCards = ({ cards }: CardsProps) => {
    return (
        <section id="bottom-cards" className="card-deck">
            {cards.map((card) => (
                <CardContainer card={card} key={card.id} />
            )
            )}
        </section >
    );
};

