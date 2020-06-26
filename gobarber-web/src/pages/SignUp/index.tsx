import React from 'react';
import { FiArrowLeft, FiMail, FiLock, FiUser } from 'react-icons/fi';

import { Container, Content, Background } from './styles';
import imgLogo from '../../assets/logo.svg';

import Button from '../../components/Button';
import Input from '../../components/Input';

export const SignUp: React.FC = () => (
  <Container>
    <Background />

    <Content>
      <img src={imgLogo} alt="Logo" />
      <form>
        <h1>Faça seu cadastro </h1>

        <Input name="name" icon={FiUser} type="text" placeholder="Nome" />
        <Input name="email" icon={FiMail} type="text" placeholder="E-mail" />
        <Input
          name="password"
          icon={FiLock}
          type="password"
          placeholder="Senha"
        />

        <Button type="submit">Cadastrar</Button>
      </form>

      <a href="login">
        <FiArrowLeft size={16} />
        Voltar para logon
      </a>
    </Content>
  </Container>
);

export default SignUp;
