import React, { Component } from "react";
import { Grid, Row, Col, FormGroup, FormControl, Clearfix } from 'react-bootstrap';
import Draggable from 'react-draggable';
import Switch from 'react-ios-switch';
import "./css/App.scss";

class Survey extends Component {
  Types = {
    'textbox': 'Textbox Question',
    'check': 'Multiple Choice Question',
    'radio': 'Single Choice Question',
    'comment': 'Comment Question'
  };

  constructor(props) {
    super(props);
    this.state = {
      questions: [
        {
          id: "q-1",
          order: 1,
          type: "radio",
          question: "",
          required: false,
          options: [{ id: 'o-1', order: 1, content: '' }, { id: 'o-2', order: 2, content: '' }]
        }
      ]
    };

    this.questionChange = this.questionChange.bind(this);
    this.questionSetRequired = this.questionSetRequired.bind(this);
    this.optionAdd = this.optionAdd.bind(this);
    this.optionRemove = this.optionRemove.bind(this);
    this.optionChange = this.optionChange.bind(this);
  }

  questionChange(e) {
    e.preventDefault();
    let questionsCopy = [...this.state.questions];
    let index = questionsCopy.findIndex((q) => q.id === e.target.id);
    questionsCopy[index].question = e.target.value;
    this.setState({ questions: questionsCopy });
  }

  questionSetRequired(questionId, required) {
    let questionsCopy = [...this.state.questions];
    let index = questionsCopy.findIndex((q) => q.id === questionId);
    questionsCopy[index].required = required;
    this.setState({ questions: questionsCopy });
  }

  optionAdd(questionId, option) {

  }

  optionRemove(questionId, optionId) {
    let questionsCopy = [...this.state.questions];
    let qIndex = questionsCopy.findIndex((q) => q.id === questionId);
    let oIndex = questionsCopy[qIndex].options.findIndex((o) => o.id === optionId);
    questionsCopy[qIndex].options.splice(oIndex, 1);
    this.setState({ questions: questionsCopy });
  }

  optionChange(questionId, e) {
    e.preventDefault();
    let questionsCopy = [...this.state.questions];
    let qIndex = questionsCopy.findIndex((q) => q.id === questionId);
    let oIndex = questionsCopy[qIndex].options.findIndex((o) => o.id === e.target.id);
    questionsCopy[qIndex].options[oIndex].content = e.target.value;
    this.setState({ questions: questionsCopy });
  }

  render() {
    return (
      <div className="survey bg-grey-200 p-24">
        {this.state.questions.map(item => {
          item.questionChange = this.questionChange;
          item.questionSetRequired = this.questionSetRequired;
          item.optionAdd = this.optionAdd;
          item.optionRemove = this.optionRemove;
          item.optionChange = this.optionChange;

          return <Question
            key={item.id}
            {...item}
            typeName={this.Types[item.type]}
          />;
        })}
      </div>
    );
  }
}

class OptionItem extends Component {
  render() {
    return (
      <div className='option-item ml-16 mr-16 mb-4' id={this.key}>
        <div className={'symbol mr-8 ' + this.props.type} />
        <div className='content'>
          <FormGroup
            key={this.props.id}
            controlId={this.props.id}
            className='text mr-4 mb-0 '
          >
            <FormControl
              key={this.props.id}
              type="text"
              value={this.props.content}
              placeholder={"Option " + this.props.order}
              onChange={(e) => this.props.optionChange(this.props.questionId, e)}
            />
          </FormGroup>
          <div onClick={() => this.props.optionRemove(this.props.questionId, this.props.id)} className='delete'>&#10006;</div>
        </div>
      </div>
    );
  }
}

class Question extends Component {
  constructor(props) {
    super(props);
  }

  getValidationState() {
    return null;
  }

  render() {
    return (
      <Item id={this.props.id}>
        <Grid className='question'>
          <Row className='header mt-4'>
            <Clearfix visibleXsBlock visibleSmBlock visibleMdBlock visibleLgBlock>
              <Col xs={6} sm={6} md={6} lg={6} className='font_small black font-weight-bold'> Q{this.props.order} </Col>
              <Col xs={6} sm={6} md={6} lg={6} className='text-right font_small'> {this.props.typeName} </Col>
            </Clearfix>
          </Row>
          <Row className='body'
            onMouseDown={(e) => { e.stopPropagation() }}
            onDrag={(e) => { e.stopPropagation() }}>
            <FormGroup
              key={this.props.id}
              controlId={this.props.id}
              className='mb-0 mr-16 ml-16'
            >
              <FormControl
                key={this.props.id}
                type="text"
                value={this.props.question}
                placeholder="Enter question"
                onChange={this.props.questionChange}
              />
            </FormGroup>
          </Row>
          <Row className='options'
            onMouseDown={(e) => { e.stopPropagation() }}
            onDrag={(e) => { e.stopPropagation() }}>
            {this.props.options.map((op) => {
              op.optionChange = this.props.optionChange;
              op.optionRemove = this.props.optionRemove;
              op.questionId = this.props.id;
              op.type = this.props.type;
              return <OptionItem key={op.id} {...op} />
            })}
          </Row>
          <Row className='footer font_small'
            onMouseDown={(e) => { e.stopPropagation() }}
            onDrag={(e) => { e.stopPropagation() }}>
            <Col xs={6} md={6} sm={6} className=''><a href='#' className='text-danger font_small'>Delete</a></Col>
            <Col xs={6} md={6} sm={6} className='required'>
              <span>Required</span>
              <Switch
                checked={this.props.required}
                className="switcho"
                onColor="#00A3FF"
                onChange={checked => this.props.questionSetRequired(this.props.id, checked)}
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
      <Draggable>
        <div className='item-frame'>
          <div className='item'>
            {this.props.children}
          </div>
          <div className='endpoint'><div className='plus'>+</div></div>
        </div>
      </Draggable>
    );
  }
}

export default Survey;
