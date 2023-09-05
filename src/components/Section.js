const categoryTitles = {
  clothing: 'Clothing & Jewelry',
  electronics: 'Electronics & Gadgets',
  toys: 'Toys & Gaming',
};

const Section = ({ title, children }) => {
  return (
    <div className="cards__section">
      <h3 id={title}>{categoryTitles[title]}</h3>
      <hr />
      <div className="cards">{children}</div>
    </div>
  );
};

export default Section;
