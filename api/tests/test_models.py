from fixtures import make_models, make_datetime_5_min_ago
from services.cie import ModuleService, UserService


def test_active_session():
    models, _, _, _ = make_models()
    module = models.CieModule(name="Test Module Name", description="desc", image_path="/")
    module.add()

    five_min_ago = make_datetime_5_min_ago()
    created_session = models.ModuleSession(
        cie_module_id=module.id, session_datetime=five_min_ago)
    created_session.add()

    module_service = ModuleService(models)

    mod_session_id = created_session.id
    module_session_sqla = module_service.get_module_session_by_id(mod_session_id)

    user_service = UserService(models)
    user = user_service.create_user("some.email@email.com",
                                    first_name="FakeFirst",
                                    last_name="FakeLast")

    user = models.User.query.filter_by(id=user.id).one()
    user_reg = user.add_to_module_session(module_session_sqla)

    _as = models.ActiveSession(
        is_active=True,
        module_session_id=user_reg.module_session_id,
        video_channel="video-channel-name",
        prezzie_link="https://wwww.someslidelink.com",
        chat_channel="chat-channel-name"
    )
    _as.add()

    uas = models.UserActiveSession(
        user_id=user_reg.id,
        active_session_id=_as.id
    )
    uas.add()

    assert _as.id == 1
    assert uas.active_session_id == 1
