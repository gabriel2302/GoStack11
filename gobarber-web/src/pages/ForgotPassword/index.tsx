/* eslint-disable @typescript-eslint/ban-types */
import React, { useCallback, useRef } from 'react';
import { FiLogIn, FiMail } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';

import { useToast } from '../../hooks/toast';

import { Container, Content, AnimationContainer, Background } from './styles';
import imgLogo from '../../assets/logo.svg';

import Button from '../../components/Button';
import Input from '../../components/Input';

import getValidationErrors from '../../utils/getValidationErrors';
import api from '../../services/api';

interface ForgotPasswordFormData {
  email: string;
}

export const ForgotPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async (data: ForgotPasswordFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('E-mail inválido'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        // recuperação de senha
        await api.post('/password/forgot', {
          email: data.email,
        });

        addToast({
          type: 'success',
          title: 'E-mail de recuperação enviado',
          description:
            'Enviamos um e-mail para confirmar a recuperação de senha, cheque sua caixa de entrada',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);
          return;
        }

        addToast({
          type: 'error',
          title: 'Erro na recuperação de senha',
          description:
            'Ocorreu um erro ao tentar realizar a recuperação de senha, tente novamente.',
        });
      }
    },
    [addToast],
  );

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={imgLogo} alt="Logo" />
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Recuperar senha</h1>

            <Input
              name="email"
              icon={FiMail}
              type="text"
              placeholder="E-mail"
            />

            <Button type="submit">Recuperar</Button>
          </Form>

          <Link to="/">
            <FiLogIn size={16} />
            Voltar ao login
          </Link>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default ForgotPassword;
