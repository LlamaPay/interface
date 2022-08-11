import AnteWidget from '@antefinance/ante-widget-react';
import '@antefinance/ante-widget/dist/widget.css';

const Footer = () => {
  return (
    <footer>
      <div className="float-right mr-3 pt-3">
        <AnteWidget.Protocol name="LlamaPay" chain="0x1" />
      </div>
    </footer>
  );
};
export default Footer;
