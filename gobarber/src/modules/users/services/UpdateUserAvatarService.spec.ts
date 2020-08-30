import AppError from '@shared/errors/AppError';

import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatar: UpdateUserAvatarService;

describe('UpdateAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();
    updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );
  });

  it('should be able to update avatar from user', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Gabriel',
      email: 'gabriel@gmail.com',
      password: '123456',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: 'arquivo.png',
    });

    expect(user.avatar).toBe('arquivo.png');
  });

  it('should not be able to update avatar from non existing user', async () => {
    await expect(
      updateUserAvatar.execute({
        user_id: 'non-existing-user',
        avatarFileName: 'arquivo.png',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should delete old avatar when new updating new one', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUsersRepository.create({
      name: 'Gabriel',
      email: 'gabriel@gmail.com',
      password: '123456',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: 'arquivo.png',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: 'avatar.png',
    });

    expect(deleteFile).toHaveBeenCalledWith('arquivo.png');

    expect(user.avatar).toBe('avatar.png');
  });
});
