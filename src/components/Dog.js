import React, { Component } from 'react';

class Dog extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      image: '',
      dogs: [],
      input: false,
      inputValue: '',
      names: [],
    };
  }

  fetchApi = (link = 'https://dog.ceo/api/breeds/image/random') => {
    this.setState({ loading: true, input: false }, async () => {
      let image = link;
      if(link === 'https://dog.ceo/api/breeds/image/random'){
        const response = await fetch(link);
        const respJson = await response.json();
        image = respJson.message;
      } 
      this.setState({
        loading: false,
        image,
        input: true
      });
    });
  };

  componentDidMount = () => {
    if(localStorage.getItem('data') !== null){
      const dogs = JSON.parse(localStorage.getItem('data'))
      const link = dogs[dogs.length-1].image;
      this.fetchApi(link);
    } else{
      this.fetchApi();
    }
  };

  addDog = () => {
    this.saveDogs();
    this.fetchApi();
  };

  saveDogs = () => {
    const { image, dogs } = this.state;
    this.setState({
      dogs: [...dogs, image],
    }, () => {
      localStorage.setItem('url', this.state.image)
    });
  };

  shouldComponentUpdate = (nextProps, nextState) => {
    const { image } = nextState;
    return !image.includes('terrier');
  }

  componentDidUpdate = (prevProps, prevState) => {
    const { image: prevImage } = prevState;
    const { image } = this.state;
    if( prevImage === image ) return;
    const regex = /https:\/\/images.dog.ceo\/breeds\/(.+)\/.*/
    const breed = regex.exec(image);
    image && alert(breed[1])
  }

  addName = ({target}) => {
    const { names, inputValue, image } = this.state;
    this.setState({
      names: [...names, { name: inputValue, image }],
      inputValue: '',
      input: false
    }, () => {
      localStorage.setItem('data', JSON.stringify(this.state.names))
    })
  }

  handleChange = ({target}) => {
    const { name, value } = target;
    this.setState({
      [name]: value,
    })
  }

  inputName = () => {
    const { inputValue } = this.state;
    return(
      <label>
        Nome
        <input type="text" value={ inputValue } onChange={ this.handleChange } name="inputValue" />
        <button type="button" onClick={ this.addName } >
          Adicionar nome
        </button>
      </label>
    )
  }
  render() {
    const { loading, image, dogs, input } = this.state;
    return (
      <section>
        {dogs.map((dog, index) => (
          <img src={dog} alt="dog" key={index} />
        ))}
        {loading ? <span>Loading...</span> : <img src={image} alt="dog" />}
        {input && this.inputName()}
        <button type="button" onClick={this.addDog}>
          More
        </button>
      </section>
    );
  }
}

export default Dog;
