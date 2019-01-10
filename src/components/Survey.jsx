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
    addQuestion(parentId, optionId, originEndpointId, e) {
        // Get location and size of parent question also which option was clicked on the popup
        const boundingRect = ReactDOM.findDOMNode(this.refs[parentId]).getBoundingClientRect();
        const typeOfQuestion = e.target.id;

        // Create copy of question, add the question and change the link of the parent
        let questionsCopy = [...this.state.questions];
        let newQuestion = Types[typeOfQuestion].initialState();
        newQuestion.type = typeOfQuestion;

        let qIndex = questionsCopy.findIndex((q) => q.id === parentId);
        newQuestion.order = questionsCopy[qIndex].order + 1;

        // Switch statement for option or question TODO
        if (optionId !== null) {
            newQuestion.position = {
                x: boundingRect.x + boundingRect.width + 70,
                y: boundingRect.y
            };

            newQuestion.from = optionId;

            // Create endpoint at the top which indicates that its a child
            let rootEndpoint = Endpoint.initialState(
                'left',
                null,
                originEndpointId
            );
            newQuestion.endpoints = [...newQuestion.endpoints, rootEndpoint];

            // Set pointer to child on parent option
            let oIndex = questionsCopy[qIndex].options.findIndex(o => o.id === optionId);
            questionsCopy[qIndex].options[oIndex].to = newQuestion.id;

            // Set target of origin endpoint
            let eIndex = questionsCopy[qIndex].options[oIndex].endpoints.findIndex(o => o.id === originEndpointId);
            questionsCopy[qIndex].options[oIndex].endpoints[eIndex].target = rootEndpoint.id;

        } else {

            // Set position 70 px lower that the parent question
            newQuestion.position = {
                x: boundingRect.x,
                y: boundingRect.y + boundingRect.height + 70
            };
            newQuestion.from = parentId;

            // Create endpoint at the top which indicates that its a child
            let rootEndpoint = Endpoint.initialState(
                'top',
                null,
                originEndpointId
            );
            newQuestion.endpoints = [...newQuestion.endpoints, rootEndpoint];

            // Set pointer to child on parent
            questionsCopy[qIndex].to = newQuestion.id;

            // Set target of origin endpoint
            let eIndex = questionsCopy[qIndex].endpoints.findIndex(o => o.id === originEndpointId);
            questionsCopy[qIndex].endpoints[eIndex].target = rootEndpoint.id;
        }

        questionsCopy.push(newQuestion)
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
        if (this._hasConnections(questionsCopy[qIndex])) return;

        // Find parent endpoint
        let fromId = questionsCopy[qIndex].from;
        let fromEndpointIndex = questionsCopy[qIndex].endpoints.find(e => e.from).from;

        if (questionsCopy[qIndex].from[0] === 'q') {
            // Remove pointer from parent question
            let parentQuestionIndex = questionsCopy.findIndex((q) => q.id === fromId);
            questionsCopy[parentQuestionIndex].to = null;

            // Remove endpoint
            let eIndex = questionsCopy[parentQuestionIndex].endpoints.findIndex(e => e.id === fromEndpointIndex);
            questionsCopy[parentQuestionIndex].endpoints[eIndex].target = null;
        } else {
            // Remove pointer from parent option
            let parentQuestionIndex = questionsCopy.findIndex(q => q.options.some(function (o) { return o.id === fromId }));
            let parentOptionIndex = questionsCopy[parentQuestionIndex].options.findIndex(o => o.id === fromId);
            questionsCopy[parentQuestionIndex].options[parentOptionIndex].to = null;

            // Remove endpoint reference
            let eIndex = questionsCopy[parentQuestionIndex].options[parentOptionIndex].endpoints.findIndex(e => e.id === fromEndpointIndex);
            questionsCopy[parentQuestionIndex].options[parentOptionIndex].endpoints[eIndex].target = null;
        }

        questionsCopy.splice(qIndex, 1);
        this.setState({ questions: questionsCopy });
    }

    _hasConnections(question) {
        return this.state.questions.length === 1 || question.to !== undefined || (question.options !== 'undefined' ? question.options.some(o => o.to) : false);
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
            position: { x: 25, y: 25 },
            endpoints: [{ id: Util.generateId('e'), position: 'bottom', target: null }]
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

    // We need these to make the addQuestion on the endpoint work
    _getEndpointContainerIds() {
        // If id starts with 'q' then its a question endpoint
        // That means that the question id is the id in the props
        // When its an option we need to get it from the supplemented 'questionId'
        let props = this.props;
        if (props.id[0] === 'q') {
            return {
                questionId: props.id,
                optionId: null
            }
        } else {
            return {
                questionId: props.questionId,
                optionId: props.id
            }
        }
    }


    render() {
        let frame = (
            <div id={this.props.id} className='item-frame'>
                <div className='item'>
                    {this.props.children}
                    {this.props.endpoints.map(e => {
                        e.addQuestion = this.props.addQuestion;
                        return <Endpoint key={e.id} {...e} ids={this._getEndpointContainerIds()} />
                    })}
                </div>
            </div>
        );

        return (
            this.props.draggable ? this._makeDraggable(frame) : frame
        );
    }
}

export class Endpoint extends React.Component {
    static initialState(position, target, from) {
        return { id: Util.generateId('e'), position: position, target: target, from: from }
    }

    _makePoppapable(component) {
        const popover = (
            // Popover content with the list of question types
            <ListGroup>
                {Object.keys(Types).map((key) => {
                    return (
                        <ListGroupItem key={key} id={key}
                            onClick={(e) =>
                                this.props.addQuestion(
                                    this.props.ids.questionId,
                                    this.props.ids.optionId,
                                    this.props.id,
                                    e
                                )}>
                            {key}
                        </ListGroupItem>
                    );
                })}
            </ListGroup>
        );

        return (
            <PopOverStickOnHover placement={this.props.position} component={popover}>
                {component}
            </PopOverStickOnHover>
        );
    }

    _generateClasses() {
        let endpoint = this.props;
        let classes = 'endpoint ';
        classes += endpoint.position + ' ';

        // If it has a target it means that its busy
        classes += endpoint.from ? 'busy ' : (endpoint.target ? 'busy ' : 'free ');
        return classes;
    }

    _generateRelationProps() {
        return this.props.target !== null && {
            targetId: this.props.target,
            targetAnchor: this.props.position === 'bottom' ? 'top' : 'left',
            sourceAnchor: this.props.position
        };
    }

    render() {
        let endpoint = (
            <div id={this.props.id} className={this._generateClasses()}>
                <ArcherElement id={this.props.id} relations={[this._generateRelationProps()]}>
                    <div className='plus'>+</div>
                </ArcherElement>
            </div>
        );

        return (
            this._makePoppapable(endpoint)
        );
    }
}
export default Survey;