import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface CardImageModalProps {
  imageUrl: string;
  cardName: string;
  deckName: string;
  triggerClassName?: string;
  imageClassName?: string;
}

export const CardImageModal = ({ imageUrl, cardName, deckName, triggerClassName, imageClassName }: CardImageModalProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className={cn(
          "cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary rounded-lg transition-all hover:opacity-90",
          triggerClassName
        )}>
          <img
            src={imageUrl}
            alt={`${cardName} - Commander of ${deckName}`}
            className={cn("rounded-lg object-contain", imageClassName)}
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
