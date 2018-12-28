import React, { Component } from "react";
import { Grid, Row, Col, FormGroup, FormControl } from 'react-bootstrap';
import Draggable from 'react-draggable';
import Switch from 'react-ios-switch';
import "./css/App.scss";

class Survey extends Component {
  Types = {
    'textbox': TextboxQuestion
  };

  constructor(props) {
    super(props);
    this.state = {
      questions: [
        {
          id: "q-1",
          priority: 1,
          type: "textbox",
          question: "Do you drink milk?",
          required: false
        }
      ]
    };
  }

  render() {
    return (
      <div className="survey bg-grey-200 p-24">
        {this.state.questions.map(item => {
          let QuestionType = this.Types[item.type];
          return <QuestionType key={item.id} {...item} />;
        })}
      </div>
    );
  }
}

class TextboxQuestion extends Component {
  render() {
    return <Question {...this.props} typeName='Textbox Question' />;
  }
}

class Question extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id,
      type: this.props.type,
      priority: this.props.priority,
      question: this.props.question,
      required: this.props.required
    };

    this.handleChange = this.handleChange.bind(this);
  }

  getValidationState() {
    return 'success';
  }

  handleChange(e) {
    e.preventDefault();
    this.setState({ question: e.target.value });
  }

  render() {
    return (
      <Item id={this.props.id}>
        <Grid className='question'>
          <Row className='header mt-4'>
            <Col md={6} className='font_small black font-weight-bold'> Q{this.props.priority} </Col>
            <Col md={6} className='text-right font_small'> {this.props.typeName} </Col>
          </Row>
          <Row className='body'
            onMouseDown={(e) => { e.stopPropagation() }}
            onDrag={(e) => { e.stopPropagation() }}>
            <FormGroup
              key={this.props.id}
              controlId="questionText"
              validationState={this.getValidationState()}
              className='mb-0 mr-16 ml-16'
            >
              <FormControl
                key={this.props.id}
                type="text"
                value={this.state.question}
                placeholder="Enter question"
                onChange={this.handleChange}
              />
            </FormGroup>
          </Row>
          <Row className='footer font_small'
            onMouseDown={(e) => { e.stopPropagation() }}
            onDrag={(e) => { e.stopPropagation() }}>
            <Col md={6} className=''><a href='#' className='text-danger font-small'>Delete</a></Col>
            <Col md={6} className='text-right'>
              <span>Required</span>
              <Switch
                checked={this.state.required}
                className="switch ml-4"
                onChange={checked => this.setState({ required: checked })}
              />
            </Col>
          </Row>
        </Grid>
      </Item>
    );
  }
}


class Item extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id,
      isDraggable: true,
      endpoints: this.props.endpoints
    };
  }

  render() {
    return (
      <Draggable><div className='item'>{this.props.children}</div></Draggable>
    );
  }
}

export default Survey;
