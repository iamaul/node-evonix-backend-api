module.exports = (sequelize, DataTypes) => {
    return sequelize.define('User', {
        name: {
            type: DataTypes.STRING(24),
            allowNull: false
        },
        email: { type: DataTypes.STRING(100) },
        email_verified: { type: DataTypes.TINYINT },
        password: { type: DataTypes.STRING(129) },
        ipv4: { type: DataTypes.INTEGER(11) },
        registered_date: { type: DataTypes.BIGINT },
        admin: { type: DataTypes.INTEGER(11) },
        helper: { type: DataTypes.INTEGER(11) },
        lastlogin: { type: DataTypes.INTEGER(11) },
        ucp_register_ip: { type: DataTypes.STRING(20) },
        ucp_login_ip: { type: DataTypes.STRING(20) }
    }, { tableName: 'users' });
}