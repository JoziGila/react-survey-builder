import React, { Component } from "react";
import ReactDOM from 'react-dom';
import { Grid, Row, Col, Clearfix, FormGroup, FormControl, ListGroup, ListGroupItem } from 'react-bootstrap';
import Switch from 'react-ios-switch';
import Draggable from 'react-draggable';
import { ArcherContainer, ArcherElement } from 'react-archer';
import { Types, TextboxQuestion, MultipleChoiceQuestion, SingleChoiceQuestion, CommentQuestion } from './QuestionTypes';
import PopOverStickOnHover from './PopOverStickOnHover';
import Util from './Util';
import OptionItem from './Extensions'

export class Survey extends Component {
    constructor(props) {
        super(props);

        // TODO: Create a question data class as to have standard objects
        this.state = {
            questions: [MultipleChoiceQuestion.initialState()]
        };

        // Bind the stuff
        this.questionChangeText = this.questionChangeText.bind(this);
        this.optionChangeText = this.optionChangeText.bind(this);
        this.questionSetRequired = this.questionSetRequired.bind(this);
        this.addOption = this.addOption.bind(this);
        this.addQuestion = this.addQuestion.bind(this);
        this.removeOption = this.removeOption.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
        this.removeQuestion = this.removeQuestion.bind(this);
    }

    // Handles the change event from the question boxes
    // Refactor this to not use events but only the parameters it needs??
    questionChangeText(e) {
        e.preventDefault();
        let questionsCopy = [...this.state.questions];
        let index = questionsCopy.findIndex((q) => q.id === e.target.id);
        questionsCopy[index].question = e.target.value;
        this.setState({ questions: questionsCopy });
    }

    // Handles change event from the option boxes
    optionChangeText(questionId, e) {
        e.preventDefault();
        let questionsCopy = [...this.state.questions];
        let qIndex = questionsCopy.findIndex((q) => q.id === questionId);
        let oIndex = questionsCopy[qIndex].options.findIndex((o) => o.id === e.target.id);
        questionsCopy[qIndex].options[oIndex].content = e.target.value;
        this.setState({ questions: questionsCopy });
    }

    // Handles the state of the required switch
    questionSetRequired(questionId, required) {
        let questionsCopy = [...this.state.questions];
        let qIndex = questionsCopy.findIndex((q) => q.id === questionId);
        questionsCopy[qIndex].required = required;
        this.setState({ questions: questionsCopy });
    }

    // Adds options ...duh
    addOption(questionId) {
        // Get context also the highest option order so we can increment it
        let questionsCopy = [...this.state.questions];
        let qIndex = questionsCopy.findIndex((q) => q.id === questionId);
        let lastOrder = Math.max(...questionsCopy[qIndex].options.map((a) => a.order));

        let option = OptionItem.initialState();
        option.order = lastOrder ? lastOrder + 1 : 1;

        questionsCopy[qIndex].options.push(option);
        this.setState({ questions: questionsCopy });
    }

    // Creates a question linked to the parent
    addQuestion(parentQuestionId, e) {
        // Get location and size of parent question also which option was clicked on the popup
        const boundingRect = ReactDOM.findDOMNode(this.refs[parentQuestionId]).getBoundingClientRect();
        const optionSelected = e.target.id;

        // Create copy of question, add the question and change the link of the parent
        let questionsCopy = [...this.state.questions];
        let qIndex = questionsCopy.findIndex((q) => q.id === parentQuestionId);

        let newQuestion = Types[optionSelected].initialState();
        newQuestion.position = {
            x: boundingRect.x,
            y: boundingRect.y + boundingRect.height + 70
        };
        newQuestion.order = questionsCopy[qIndex].order + 1;
        newQuestion.from = parentQuestionId;
        questionsCopy.push(newQuestion);

        questionsCopy[qIndex].to = newQuestion.id;


        this.setState({ questions: questionsCopy });
    }

    removeOption(questionId, optionId) {
        let questionsCopy = [...this.state.questions];
        let qIndex = questionsCopy.findIndex((q) => q.id === questionId);
        if (questionsCopy[qIndex].options.length === 1) return;

        let oIndex = questionsCopy[qIndex].options.findIndex((o) => o.id === optionId);
        questionsCopy[qIndex].options.splice(oIndex, 1);
        this.setState({ questions: questionsCopy });
    }

    removeQuestion(questionId) {
        let questionsCopy = [...this.state.questions];
        let qIndex = questionsCopy.findIndex((q) => q.id === questionId);
        if (questionsCopy[qIndex].to) return;

        let fromIndex = questionsCopy.findIndex((q) => q.id === questionsCopy[qIndex].from);
        questionsCopy[fromIndex].to = undefined;
        questionsCopy.splice(qIndex, 1);

        this.setState({ questions: questionsCopy });
    }

    handleDrag(e, data) {
        e.preventDefault();
        let questionsCopy = [...this.state.questions];
        let qIndex = questionsCopy.findIndex((q) => q.id === data.node.id);
        questionsCopy[qIndex].position = {
            x: data.x,
            y: data.y
        }
        this.setState({ questions: questionsCopy });
    }

    render() {
        return (
            <ArcherContainer strokeColor='#ADBDCC' arrowThickness={5}>
                <div className="survey bg-grey-200">

                    {this.state.questions.map(item => {
                        // Adding the functions to the props
                        item.questionChangeText = this.questionChangeText;
                        item.questionSetRequired = this.questionSetRequired;
                        item.addOption = this.addOption;
                        item.removeOption = this.removeOption;
                        item.optionChangeText = this.optionChangeText;
                        item.addQuestion = this.addQuestion;
                        item.handleDrag = this.handleDrag;
                        item.removeQuestion = this.removeQuestion;

                        // Resolve the class
                        let ClassType = Types[item.type];

                        return <ClassType ref={item.id} key={item.id} {...item} />;
                    })}
                </div>
            </ArcherContainer>
        );
    }
}

export class Question extends Component {
    static initialState() {
        return {
            id: Util.generateId('q'),
            question: "",
            order: 1,
            required: false,
            position: { x: 25, y: 25 }
        }
    }

    render() {
        return (
            // Wrap with item which makes it cooler
            <Item
                key={this.props.id}
                draggable={true}
                {...this.props}>
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
                                onChange={this.props.questionChangeText}
                            />
                        </FormGroup>
                    </Row>
                    <Row className='extensions'
                        onMouseDown={(e) => { e.stopPropagation() }}
                        onDrag={(e) => { e.stopPropagation() }}>
                        {this.props.children}
                    </Row>
                    <Row className='footer font_small mb-4'
                        onMouseDown={(e) => { e.stopPropagation() }}
                        onDrag={(e) => { e.stopPropagation() }}>
                        <Col xs={6} md={6} sm={6} className=''><a onClick={() => this.props.removeQuestion(this.props.id)} className='text-danger font_small'>Delete</a></Col>
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
            <Draggable
                onDrag={this.props.handleDrag}
                onStart={this.props.handleDrag}
                onStop={this.props.handleDrag}
                defaultPosition={{ x: this.props.position.x, y: this.props.position.y }}>
                {component}
            </Draggable>
        );
    }


    render() {
        const popover = (
            <ListGroup>
                {Object.keys(Types).map((key) => {
                    return <ListGroupItem key={key} id={key} onClick={(e) => this.props.addQuestion(this.props.id, e)}>{key}</ListGroupItem>
                })}
            </ListGroup>
        );

        // Refactor endpoints in a separate component, too heavy
        var endpointIn = (
            <ArcherElement id={this.props.id + '-in'}>
                {this.props.order !== 1 && <div id={this.props.id + '-in'} className={'endpoint in ' + (this.props.from && 'connected')} />}
            </ArcherElement>
        );

        var endpointOut = (
            <PopOverStickOnHover placement="bottom" component={popover}>
                <div id={this.props.id + '-out'} to={this.props.to} className={'endpoint out ' + (this.props.to && 'connected')}>
                    <ArcherElement
                        id={this.props.id + '-out'}
                        relations={this.props.to && [{
                            targetId: this.props.to + '-in',
                            targetAnchor: 'top',
                            sourceAnchor: 'bottom',
                        }]}>

                        {!this.props.to && <div className='plus'>+</div>}
                    </ArcherElement>
                </div>
            </PopOverStickOnHover >
        );

        const frame = (
            <div id={this.props.id} className='item-frame'>
                {endpointIn}
                <div className='item'>
                    {this.props.children}
                </div>
                {endpointOut}
            </div>
        );

        return (
            this.props.draggable ? this._makeDraggable(frame) : frame
        );
    }
}

export default Survey;