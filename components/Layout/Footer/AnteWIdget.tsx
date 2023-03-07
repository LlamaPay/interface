import AnteWidget from '@antefinance/ante-widget-react';
import '@antefinance/ante-widget/dist/widget.css';

export default function Widget() {
  return (
    <div className="fixed bottom-2 right-2 z-20 flex w-full justify-end">
      {/* <AnteWidget.Protocol name="LlamaPay" chain="0x1" /> */}
    </div>
  );
}
