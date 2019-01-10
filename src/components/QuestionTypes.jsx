import React, { Component } from "react";
import { Question } from './Survey';
import OptionItem from './Extensions';

export class TextboxQuestion extends Component {
    static initialState() {
        let base = Question.initialState();
        base.type = 'textbox';
        return base;
    }

    static toString() {
        return 'Textbox Question';
    }

    render() {
        return <Question key={this.props.id} {...this.props} name={SingleChoiceQuestion.toString()} />
    }
}

export class MultipleChoiceQuestion extends Component {
    static initialState() {
        let base = Question.initialState();
        base.type = 'check';
        base.options = [OptionItem.initialState()];
        return base;
    }

    static toString() {
        return 'Multiple Choice Question';
    }

    render() {
        return (
            <Question key={this.props.id} {...this.props} name={MultipleChoiceQuestion.toString()}>
                {this.props.options.map((op) => {
                    op.optionChangeText = this.props.optionChangeText;
                    op.addQuestion = this.props.addQuestion;
                    op.removeOption = this.props.removeOption;
                    op.questionId = this.props.id;
                    op.type = this.props.type;

                    return <OptionItem key={op.id} {...op} />
                })}
                <div className='ml-16 add' onClick={() => this.props.addOption(this.props.id)}><span>+</span> Add Option</div>
            </Question>
        )
    };
}

export class SingleChoiceQuestion extends Component {
    static initialState() {
        let base = Question.initialState();
        base.type = 'radio';
        base.options = [OptionItem.initialState()];
        return base;
    }

    static toString() {
        return 'Single Choice Question';
    }

    render() {
        return (
            <Question key={this.props.id} {...this.props} name={SingleChoiceQuestion.toString()}>
                {this.props.options.map((op) => {
                    op.optionChangeText = this.props.optionChangeText;
                    op.removeOption = this.props.removeOption;
                    op.addQuestion = this.props.addQuestion;
                    op.questionId = this.props.id;
                    op.type = this.props.type;
                    return <OptionItem key={op.id} {...op} />
                })}
                <div className='ml-16 add' onClick={() => this.props.addOption(this.props.id)}><span>+</span> Add Option</div>
            </Question>
        )
    }
}

export class CommentQuestion extends Component {
    static initialState() {
        let base = Question.initialState();
        base.type = 'comment';
        return base;
    }

    static toString() {
        return 'Comment Question';
    }

    render() {
        return <Question key={this.props.id} {...this.props} name={Comment.toString()} />
    }
}

export const Types = {
    'textbox': TextboxQuestion,
    'check': MultipleChoiceQuestion,
    'radio': SingleChoiceQuestion,
    'comment': CommentQuestion
};