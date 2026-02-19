import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export default function FAQModal({ open, onOpenChange }) {
  const faqItems = [
    {
      question: "What is Keeply?",
      answer: "Keeply is a Chrome extension that helps you organize links and notes into smart collections. It provides quick search, drag & drop functionality, and instant access to your saved content. You can use it as your new tab page to keep everything organized and easily accessible."
    },
    {
      question: "How do I save a link?",
      answer: "You will see the active tabs in right side (Open Tabs). Then drag and drop the tab you want to save into one of your collections."
    },
    {
      question: "How do I save a note?",
      answer: "Select the Notes menu. Then click the '+' button of a collection header where you want to create a new note. You can enter a title and description for your note, and it will be saved in the selected collection."
    },
    {
      question: "How do I create and manage collections?",
      answer: "Collections help you organize your links and notes. You can create new collections by clicking the '+' button or using the toolbar. Each collection can be renamed, and deleted when no longer needed. You can also move items between collections by dragging them."
    },
    {
      question: "How does the search feature work?",
      answer: "The search feature allows you to quickly find links and notes across all your collections. Simply type in the search bar and it will filter results by title, description, or URL. The search is debounced for better performance and works in real-time as you type."
    },
    {
      question: "Can I organize items using drag & drop?",
      answer: "Yes! Keeply supports full drag & drop functionality. You can drag links and notes within a collection to reorder them, or drag them between different collections. You can also drag entire collections to reorder them. The interface provides visual feedback during dragging."
    },
    {
      question: "How do I edit or delete items?",
      answer: "Each link and note has an edit option in its menu (three dots icon). Click on it to edit the title, description, or URL. You can also delete items from the same menu. For collections, use the dropdown menu on the collection header to edit the title or delete the entire collection."
    },
    {
      question: "Where is my data stored?",
      answer: "All your links, notes, and collections are stored locally in your browser using Chrome's storage API. This means your data stays private and is not sent to any external servers. The extension uses Chrome's unlimitedStorage permission to ensure you can save as much content as you need."
    },
    {
      question: "Can I use Keeply as my new tab page?",
      answer: "Yes! Keeply can replace your default new tab page. When you open a new tab, you'll see your Keeply interface with all your collections, making it easy to access your saved links and notes instantly."
    },
    {
      question: "Does Keeply support dark mode?",
      answer: "Yes, Keeply includes a theme toggle that allows you to switch between light and dark modes. The theme preference is saved and will persist across sessions. You can find the theme toggle in the interface."
    },
    {
      question: "What permissions does Keeply require?",
      answer: "Keeply requires the following permissions: 'activeTab' to access current tab information, 'storage' and 'unlimitedStorage' to save your data locally, 'contextMenus' to add right-click options, and 'tabs' to manage browser tabs. All permissions are used only for the extension's core functionality."
    },
    {
      question: "Can I sync my data across devices?",
      answer: "Currently, Keeply stores data locally in your browser. If you're signed into Chrome and have sync enabled, Chrome may sync some extension data, but this depends on Chrome's sync settings. Your data is primarily stored on the device where you're using the extension."
    },
    {
      question: "How do I get help or report an issue?",
      answer: "If you encounter any issues or have questions, you can check this FAQ section. For bugs or feature requests, please refer to the extension's support channels or repository. Make sure you're using the latest version of the extension for the best experience."
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] w-[550px] max-h-[85vh] h-[650px] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 flex-shrink-0">
          <DialogTitle className="text-lg sm:text-xl">Frequently Asked Questions</DialogTitle>
          <DialogDescription className="text-sm">
            Find answers to common questions about Keeply
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="px-5 border border-border">
                <AccordionTrigger className="text-left text-sm sm:text-base">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-xs sm:text-sm">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </DialogContent>
    </Dialog>
  );
}


