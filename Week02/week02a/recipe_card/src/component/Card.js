import './RecipeCard.css';

const Card = (props) => {
    //children is a prop we can as a built in , 
    // chilcren can be text, or any other tags that need to become the innerhtml of this component tag 
    const {children} = props;

    return (
        <div className="card">
            {children}
        </div>
    )
}

export default Card;