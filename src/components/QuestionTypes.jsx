import React, { Component } from "react";
import { Question } from './Survey';
import OptionItem from './Extensions';

export class TextboxQuestion extends Component {
    static initialState() {
        let base = Question.initialState();
        base.type = 'textbox';
        return base;
    }

    render() {
        return <Question key={this.props.id} {...this.props} name={'Textbox Question'} />
    }
}

export class MultipleChoiceQuestion extends Component {
    static initialState() {
        let base = Question.initialState();
        base.type = 'check';
        base.options = [OptionItem.initialState()];
        return base;
    }

    render() {
        return (
            <Question key={this.props.id} {...this.props} name={'Multiple Choice Question'}>
                {this.props.options.map((op) => {
                    op.optionChangeText = this.props.optionChangeText;
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
        base.options = [{ id: 'o-1', order: 1, content: '' }];
        return base;
    }

    render() {
        return (
            <Question key={this.props.id} {...this.props} name={'Single Choice Question'}>
                {this.props.options.map((op) => {
                    op.optionChangeText = this.props.optionChangeText;
                    op.removeOption = this.props.removeOption;
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

    render() {
        return <Question key={this.props.id} {...this.props} name={'Comment Question'} />
    }
}

export const Types = {
    'textbox': TextboxQuestion,
    'check': MultipleChoiceQuestion,
    'radio': SingleChoiceQuestion,
    'comment': CommentQuestion
};