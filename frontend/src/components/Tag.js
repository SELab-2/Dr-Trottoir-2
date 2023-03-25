export function ColoredTag({text, color}) {
  
    return (
      <div style={{backgroundColor: color,
        borderRadius: '20px',
        padding: '5px 10px',
        color: 'black',
        fontSize: '14px',
        display: 'inline-block',
        textAlign: 'center',
        margin: '5px'}}>
        {text}
      </div>
    );
}