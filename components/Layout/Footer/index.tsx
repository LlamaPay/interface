import AnteWidget from '@antefinance/ante-widget-react';
import '@antefinance/ante-widget/dist/widget.css';

const Footer = () => {
  return (
    <footer className="mr-3 flex items-center justify-end pt-3">
      <AnteWidget.Protocol name="LlamaPay" chain="0x1" />
    </footer>
  );
};
export default Footer;
