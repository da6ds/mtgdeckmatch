import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { X } from "lucide-react";

interface CardImageModalProps {
  imageUrl: string;
  cardName: string;
  deckName: string;
}

export const CardImageModal = ({ imageUrl, cardName, deckName }: CardImageModalProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary rounded-lg transition-all hover:opacity-90 flex items-center justify-center w-[72%] mx-auto bg-muted/30 aspect-[5/7]">
          <img
            src={imageUrl}
            alt={`${cardName} - Commander of ${deckName}`}
            className="w-full h-full rounded-lg object-contain"
            loading="lazy"
          />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md p-6 border-0 bg-transparent">
        <div className="relative">
          <img
            src={imageUrl}
            alt={`${cardName} - Commander of ${deckName}`}
            className="w-full max-h-[85vh] object-contain rounded-lg"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
