import React, { Component } from "react";
import { Grid, Row, Col, Clearfix, FormGroup, FormControl } from 'react-bootstrap';
import Switch from 'react-ios-switch';
import Draggable from 'react-draggable';
import { Types, TextboxQuestion, MultipleChoiceQuestion, SingleChoiceQuestion, CommentQuestion } from './QuestionTypes';

export class Survey extends Component {
    constructor(props) {
        super(props);

        // TODO: Create a question data class as to have standard objects
        this.state = {
            questions: [
                {
                    id: "q-1",
                    order: 1,
                    type: "check",
                    question: "",
                    required: false,
                    options: [{ id: 'o-1', order: 1, content: '' }, { id: 'o-2', order: 2, content: '' }]
                }
            ]
        };

        // Bind the stuff
        this.questionChange = this.questionChange.bind(this);
        this.questionSetRequired = this.questionSetRequired.bind(this);
        this.optionAdd = this.optionAdd.bind(this);
        this.optionRemove = this.optionRemove.bind(this);
        this.optionChange = this.optionChange.bind(this);
    }

    // Handles the change event from the question boxes
    // Refactor this to not use events but only the parameters it needs??
    questionChange(e) {
        e.preventDefault();
        let questionsCopy = [...this.state.questions];
        let index = questionsCopy.findIndex((q) => q.id === e.target.id);
        questionsCopy[index].question = e.target.value;
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

    // Handles the state of the required toggle
    questionSetRequired(questionId, required) {
        let questionsCopy = [...this.state.questions];
        let index = questionsCopy.findIndex((q) => q.id === questionId);
        questionsCopy[index].required = required;
        this.setState({ questions: questionsCopy });
    }

    // Adds options ...duh
    optionAdd(questionId) {
        let questionsCopy = [...this.state.questions];
        let qIndex = questionsCopy.findIndex((q) => q.id === questionId);
        let lastOrder = Math.max(...questionsCopy[qIndex].options.map((a) => a.order));
        questionsCopy[qIndex].options.push({ id: this._generateId('o'), order: lastOrder ? lastOrder + 1 : 1, content: '' });
        this.setState({ questions: questionsCopy });
    }

    optionRemove(questionId, optionId) {
        let questionsCopy = [...this.state.questions];
        let qIndex = questionsCopy.findIndex((q) => q.id === questionId);
        if (questionsCopy[qIndex].options.length === 1) return;
        let oIndex = questionsCopy[qIndex].options.findIndex((o) => o.id === optionId);
        questionsCopy[qIndex].options.splice(oIndex, 1);
        this.setState({ questions: questionsCopy });
    }

    _generateId(type) {
        // Type can either be 'q' or 'o'
        return type + '-' + crypto.getRandomValues(new Uint32Array(4)).join('');
    }

    render() {
        return (
            <div className="survey bg-grey-200 p-24">
                {this.state.questions.map(item => {
                    // Adding the functions to the props
                    item.questionChange = this.questionChange;
                    item.questionSetRequired = this.questionSetRequired;
                    item.optionAdd = this.optionAdd;
                    item.optionRemove = this.optionRemove;
                    item.optionChange = this.optionChange;

                    // Resolve the class
                    let ClassType = Types[item.type];

                    return <ClassType key={item.id} {...item} />;
                })}
            </div>
        );
    }
}

export class Question extends Component {
    render() {
        return (
            // Wrap with item which makes it cooler
            <Item id={this.props.id} draggable={true}>
                <Grid className='question'>
                    <Row className='header mt-4 mb-4'>
                        <Clearfix visibleXsBlock visibleSmBlock visibleMdBlock visibleLgBlock>
                            <Col xs={6} sm={6} md={6} lg={6} className='font_small black font-weight-bold'> Q{this.props.order} </Col>
                            <Col xs={6} sm={6} md={6} lg={6} className='text-right font_small font-light'> {this.props.name} </Col>
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
                    <Row className='extensions'
                        onMouseDown={(e) => { e.stopPropagation() }}
                        onDrag={(e) => { e.stopPropagation() }}>

                        {this.props.children}

                        <div className='ml-16 add' onClick={() => this.props.optionAdd(this.props.id)}><span>+</span> Add Option</div>
                    </Row>
                    <Row className='footer font_small mb-4'
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

// Makes things draggable and adds endpoints
export class Item extends Component {
    _makeDraggable(component) {
        return (
            <Draggable>
                {component}
            </Draggable>
        );
    }

    render() {
        let frame = (
            <div className='item-frame'>
                <div className='item'>
                    {this.props.children}
                </div>
                <div className='endpoint'><div className='plus'>+</div></div>
            </div>
        );

        return (
            this.props.draggable ? this._makeDraggable(frame) : frame
        );
    }
}

export default Survey;